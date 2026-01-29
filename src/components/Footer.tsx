import { Star, Bug, GitPullRequest, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  const version = '0.1.0';
  const repoUrl = 'https://github.com/warengonzaga/is-it-relay';

  return (
    <footer className="border-t border-border pt-6 sm:pt-8 pb-6 sm:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="space-y-3 sm:space-y-4 text-center">
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(repoUrl, '_blank', 'noopener,noreferrer')}
              className="text-xs sm:text-sm"
            >
              <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Star on GitHub
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`${repoUrl}/issues`, '_blank', 'noopener,noreferrer')}
              className="text-xs sm:text-sm"
            >
              <Bug className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Report Issue
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(repoUrl, '_blank', 'noopener,noreferrer')}
              className="text-xs sm:text-sm"
            >
              <GitPullRequest className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Contribute
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://github.com/sponsors/warengonzaga', '_blank', 'noopener,noreferrer')}
              className="text-xs sm:text-sm"
            >
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Sponsor
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="space-y-2 text-xs sm:text-sm text-muted-foreground w-full sm:max-w-lg mx-auto">
            <p className="leading-relaxed">
              <strong>Disclaimer:</strong> This is an independent community project, not officially affiliated with Relay Protocol.
              Built for informational purposes only.
            </p>

            {/* Creator and Version */}
            <div className="flex items-center justify-center gap-1">
              <span>Built by</span>
              <a
                href="https://github.com/warengonzaga"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >Waren Gonzaga</a>
              <span className="text-muted-foreground/50">&bull;</span>
              <a
                href={`${repoUrl}/releases`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground/70 hover:text-foreground hover:underline transition-colors"
              >
                v{version}
              </a>
            </div>

            {/* Follow on X Button */}
            <div className="flex justify-center mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://x.com/warengonzaga', '_blank', 'noopener,noreferrer')}
                className="text-xs sm:text-sm"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Follow @warengonzaga
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
